class ProductsController < ApplicationController
  def show
    @product        = Product.find_by_id params[:product_id]
    @mall           = Mall.find_by_permalink params[:name]
    @store          = @mall.stores.find_by permalink: params[:permalink]
    @reviews        = @product.reviews
    @average_score  = @reviews.average(:score)
    @total_score    = 5 - @average_score.to_i
    @review   = Review.new
  end
end