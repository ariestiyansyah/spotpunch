class MallsController < ApplicationController

  def show
    @mall = Mall.friendly.find(params[:id])
  end
  
end