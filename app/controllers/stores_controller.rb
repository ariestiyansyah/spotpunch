class StoresController < ApplicationController
  def show
    @mall   = Mall.find_by_permalink params[:name]
    @store  = @mall.stores.find_by permalink: params[:permalink]
  end
end
