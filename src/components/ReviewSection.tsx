import { useState } from "react";
import { Star, Send, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const MAX_REVIEW_LENGTH = 5000;

interface ReviewSectionProps {
  contentId: number;
  contentType: "movie" | "tv";
  isAuthenticated: boolean;
}

export const ReviewSection = ({ contentId, contentType, isAuthenticated }: ReviewSectionProps) => {
  const { reviews, userReview, submitReview, deleteReview, averageRating, isLoading } = useReviews(contentId, contentType);
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(userReview?.review_text || "");
  const [isWriting, setIsWriting] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    
    const trimmedText = reviewText.trim();
    if (trimmedText.length > MAX_REVIEW_LENGTH) {
      toast.error(`Review must be less than ${MAX_REVIEW_LENGTH.toLocaleString()} characters`);
      return;
    }
    
    submitReview.mutate({ rating, reviewText: trimmedText });
    setIsWriting(false);
  };

  const displayRating = hoverRating || rating;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Reviews</h2>
          {averageRating && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviews?.length})</span>
            </div>
          )}
        </div>
        {isAuthenticated && !isWriting && !userReview && (
          <Button onClick={() => setIsWriting(true)} variant="outline">
            Write Review
          </Button>
        )}
      </div>

      {/* Write Review Form */}
      {isAuthenticated && (isWriting || userReview) && (
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{userReview ? "Your Review" : "Rate this title"}</p>
            {userReview && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => deleteReview.mutate()}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                type="button"
                className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 10`}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    star <= displayRating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-lg font-semibold">{displayRating}/10</span>
          </div>

          {/* Review Text */}
          <div className="space-y-1">
            <Textarea
              placeholder="Share your thoughts (optional)..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={MAX_REVIEW_LENGTH}
            />
            <p className={cn(
              "text-xs text-right",
              reviewText.length > MAX_REVIEW_LENGTH * 0.9 ? "text-destructive" : "text-muted-foreground"
            )}>
              {reviewText.length.toLocaleString()}/{MAX_REVIEW_LENGTH.toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || submitReview.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitReview.isPending ? "Submitting..." : userReview ? "Update" : "Submit"}
            </Button>
            {isWriting && (
              <Button variant="ghost" onClick={() => setIsWriting(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <p className="text-muted-foreground text-center py-4">
          Sign in to write a review
        </p>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews?.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-2 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                  {review.display_name?.[0]?.toUpperCase() || "A"}
                </div>
                <span className="font-medium">{review.display_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{review.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(review.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            {review.review_text && (
              <p className="text-foreground/80 leading-relaxed">{review.review_text}</p>
            )}
          </div>
        ))}

        {!isLoading && reviews?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </section>
  );
};
