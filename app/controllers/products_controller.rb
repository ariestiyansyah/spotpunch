class ProductsController < ApplicationController
  
  before_action :authenticate_user!
  before_filter :modal_search_exist,       only:[:show]
  
  def show
    @product            = Product.find_by_id params[:product_id]
    @mall               = Mall.find_by_permalink params[:name]
    @store              = @mall.stores.find_by permalink: params[:permalink]
    @reviews            = @product.reviews
    @average_score      = @reviews.average(:score).to_f.round(1)
    @total_score        = 5 - @average_score.to_i
    @review             = Review.new
    @brand              = @product.brand
    @is_user_following  = current_user.following?(@brand)
    @liked_size         = @product.get_likes.size
  end

  def like
    @product            = Product.find_by_id params[:product_id]
    @product.liked_by current_user
    @liked_size         = @product.get_likes.size 
  end

  def dislike
    @product            = Product.find_by_id params[:product_id]
    @product.unliked_by current_user
    @liked_size         = @product.get_likes.size 
  end

end