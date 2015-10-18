class ReviewsController < ApplicationController
  def create
    product       = Product.find_by_id params[:product_id]
    mall          = Mall.find_by_permalink params[:name]
    store         = mall.stores.find_by permalink: params[:permalink]
    score         = params[:score].size unless params[:score].blank?
    review        = Review.new content:params[:review][:content], product:product, score:score, user:current_user, store:store
    if review.save
      review.create_activity key: 'review.create', owner: current_user
      redirect_to root_path
    end
    # review.create_activity key: 'review.create', owner: User.first
  end

  def like
    @review            = Review.find_by_id params[:review_id] 
    @review.liked_by current_user
  end

  def dislike
    @review            = Review.find_by_id params[:review_id] 
    @review.unliked_by current_user
  end

end