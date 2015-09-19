class BrandsController < ApplicationController
  before_action :authenticate_user!
  
  def follow
    @brand = Brand.find_by_id params[:brand_id]  
    current_user.follow(@brand)
  end

  def unfollow
    @brand = Brand.find_by_id params[:brand_id] 
    current_user.stop_following(@brand)
    if params[:profile]
      @following_size = current_user.follow_count
      respond_to do |format|
        format.js { render "user_unfollow" }
        format.html
      end
    else
    end
  end
end