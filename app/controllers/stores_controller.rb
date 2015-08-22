class StoresController < ApplicationController
  def show
    @store = Store.find_by_id params[:permalink]
  end
end
