class HomeController < ApplicationController
  before_action :authenticate_user!
  before_filter :modal_search_exist
  
  def index
    @user         = User.new
    @activities   = PublicActivity::Activity.all
    @uniqlo       = Store.find_by_name "Uniqlo"
    @current_user = current_user 
  end

  def profile
    @user               = User.find_by_username params[:permalink]
    @reviewsSize        = @user.reviews.count
    @reviews            = @user.reviews
    @following_size     = @user.follow_count
    @followings         = @user.all_following
    @follower_size      = @user.followers_count
    @followers          = @user.followers
    @is_user_following  = current_user.following?(@user)
  end

end
