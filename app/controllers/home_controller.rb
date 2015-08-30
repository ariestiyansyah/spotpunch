class HomeController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @user       = User.new
    @activities = PublicActivity::Activity.all
    @uniqlo     = Store.find_by_name "Uniqlo" 
  end

  def profile
    @user         = User.find_by_username params[:permalink]
    @reviewsSize  = @user.reviews.count
    @reviews      = @user.reviews
  end

end
