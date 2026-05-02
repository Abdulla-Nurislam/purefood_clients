import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, Camera, Video, MessageSquare } from 'lucide-react';
import { useToast } from './SimpleToast';

export function MyReviewsScreen() {
  const { goBack, reviews, addReview } = useApp();
  const toast = useToast();
  const [showNew, setShowNew] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  const submitReview = () => {
    if (reviewText.trim()) {
      addReview({
        id: `r-${Date.now()}`,
        productId: '1',
        productName: 'Фермерский мёд горный',
        rating: reviewRating,
        text: reviewText,
        date: '30 марта 2026',
        hasPhoto,
      });
      setReviewText('');
      setShowNew(false);
      setHasPhoto(false);
      setHasVideo(false);
      toast.success('Отзыв отправлен! Спасибо.');
    }
  };

  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Мои отзывы</h2>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="text-sm text-primary">
          + Новый
        </button>
      </div>

      {/* New review form */}
      {showNew && (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3 animate-[fadeIn_0.3s_ease-out]">
          <p className="text-sm">Оцените последний заказ</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setReviewRating(s)}>
                <Star className={`w-7 h-7 ${s <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Расскажите о качестве продуктов..."
            className="w-full bg-input-background border border-border rounded-xl p-3 text-sm min-h-[80px] resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm ${hasPhoto ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}
            >
              <Camera className="w-4 h-4" /> Фото
            </button>
            <button
              onClick={() => setHasVideo(!hasVideo)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm ${hasVideo ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}
            >
              <Video className="w-4 h-4" /> Видео
            </button>
            <button onClick={submitReview} className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm">
              Отправить
            </button>
          </div>
        </div>
      )}

      {/* Existing reviews */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <MessageSquare className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">У вас пока нет отзывов</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">{review.productName}</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{review.date}</p>
                {review.hasPhoto && (
                  <span className="text-xs bg-secondary text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Фото
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
