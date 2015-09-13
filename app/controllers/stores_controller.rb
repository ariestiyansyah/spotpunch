class StoresController < ApplicationController
  def show
    @mall     = Mall.find_by_permalink params[:name]
    @store    = @mall.stores.find_by permalink: params[:permalink]
    @products = @store.products 
  end
end
