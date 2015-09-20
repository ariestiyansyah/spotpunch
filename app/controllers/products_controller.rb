class ProductsController < ApplicationController
  before_action :authenticate_user!
  
  def show
    @product            = Product.find_by_id params[:product_id]
    @mall               = Mall.find_by_permalink params[:name]
    @store              = @mall.stores.find_by permalink: params[:permalink]
    @reviews            = @product.reviews
    @average_score      = @reviews.average(:score)
    @total_score        = 5 - @average_score.to_i
    @review             = Review.new
    @brand              = @product.brand
    @is_user_following  = current_user.following?(@brand)
  end

  def like
    @product            = Product.find_by_id params[:product_id] 
    @product.liked_by current_user
  end

  def dislike
    @product            = Product.find_by_id params[:product_id] 
    @product.unliked_by current_user
  end

end