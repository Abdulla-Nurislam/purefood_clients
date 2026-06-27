import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, Camera, X, Send, Loader2 } from 'lucide-react';
import { useToast } from './SimpleToast';
import { submitReview, uploadReviewImage, compressImage } from '../../lib/api';

const POSITIVE_TAGS = [
  'Свежие продукты',
  'Быстрая доставка',
  'Хорошая упаковка',
  'Приятный продавец',
  'Точно по заказу',
  'Отличное качество',
];

const NEGATIVE_TAGS = [
  'Опоздание',
  'Плохая упаковка',
  'Не свежие продукты',
  'Не то, что заказал',
  'Грубый курьер',
  'Неполный заказ',
];

export function WriteReviewScreen() {
  const { routeParams, goBack, orders, userId, rateOrder } = useApp();
  const toast = useToast();

  const orderId = routeParams.orderId || '';
  const order = orders.find(o => o.id === orderId);
  const firstItem = order?.items[0];

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTags = rating >= 4 ? POSITIVE_TAGS : rating > 0 ? NEGATIVE_TAGS : [];

  const handleRating = (val: number) => {
    setRating(val);
    // Reset tags when rating changes category
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePhotoAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 3 - photos.length;
    const toAdd = files.slice(0, remaining);

    const newPhotos = await Promise.all(
      toAdd.map(async file => {
        const compressed = await compressImage(file);
        const preview = URL.createObjectURL(compressed);
        return { file: compressed, preview };
      })
    );

    setPhotos(prev => [...prev, ...newPhotos]);
    e.target.value = '';
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Поставьте оценку от 1 до 5 звёзд');
      return;
    }
    if (!order || !firstItem) {
      toast.error('Заказ не найден');
      return;
    }
    if (!userId) {
      toast.error('Необходимо войти в аккаунт');
      return;
    }

    setIsSubmitting(true);

    // Upload photos
    let imageUrls: string[] = [];
    if (photos.length > 0) {
      const uploads = await Promise.all(
        photos.map(p => uploadReviewImage(p.file, userId))
      );
      imageUrls = uploads.filter(Boolean) as string[];
    }

    const result = await submitReview({
      userId,
      sellerId:    firstItem.product.supplierId,
      orderId:     order.id,
      productId:   firstItem.product.id,
      rating,
      textComment: comment.trim() || undefined,
      tags:        selectedTags,
      images:      imageUrls,
    });

    setIsSubmitting(false);

    if (result.success) {
      rateOrder(order.id, rating);
      toast.success('Спасибо за ваш отзыв! Он поможет другим покупателям');
      goBack();
    } else {
      toast.error('Не удалось отправить отзыв', { description: result.error });
    }
  };

  const ratingLabels: Record<number, string> = {
    1: 'Очень плохо',
    2: 'Плохо',
    3: 'Нормально',
    4: 'Хорошо',
    5: 'Отлично!',
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={goBack}
          className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-base font-semibold">Оставить отзыв</h2>
          {firstItem && (
            <p className="text-xs text-muted-foreground truncate">{firstItem.product.name}</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32 space-y-6">

        {/* Star rating */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => handleRating(s)}
                onMouseEnter={() => setHoveredRating(s)}
                className="transition-transform active:scale-90"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Star
                  className={`w-11 h-11 transition-all duration-150 ${
                    s <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400 scale-110'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm font-medium text-primary animate-[fadeIn_0.2s_ease-out]">
              {ratingLabels[rating]}
            </p>
          )}
        </div>

        {/* Tag chips */}
        {activeTags.length > 0 && (
          <div className="space-y-2 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm font-medium text-muted-foreground px-1">
              {rating >= 4 ? '👍 Что понравилось?' : '👎 Что можно улучшить?'}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeTags.map(tag => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                      active
                        ? rating >= 4
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-destructive text-destructive-foreground border-destructive'
                        : 'bg-secondary text-foreground border-border'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Photos */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-1">
            📸 Фото (до 3 штук)
          </p>
          <div className="flex gap-2 flex-wrap">
            {photos.map((p, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <img
                  src={p.preview}
                  alt={`photo-${idx}`}
                  className="w-20 h-20 rounded-xl object-cover border border-border"
                />
                <button
                  onClick={() => removePhoto(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="w-6 h-6" />
                <span className="text-[10px]">Добавить</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoAdd}
          />
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-1">
            💬 Комментарий (необязательно)
          </p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Расскажите о вашем опыте..."
            rows={4}
            maxLength={1000}
            className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground text-right">{comment.length}/1000</p>
        </div>
      </div>

      {/* Fixed submit button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border p-4 z-50">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
            rating === 0
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
        </button>
      </div>
    </div>
  );
}
