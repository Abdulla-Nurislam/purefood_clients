import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, Camera, Video, MessageSquare } from 'lucide-react';
import { useToast } from './SimpleToast';

export function MyReviewsScreen() {
  const { goBack, reviews } = useApp();



  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Мои отзывы</h2>
        </div>
      </div>

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
