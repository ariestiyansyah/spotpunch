class MallsController < ApplicationController
  
  before_action :authenticate_user!
  before_filter :modal_search_exist,       only:[:show]

  def show
    @mall               = Mall.friendly.find(params[:id])
    @is_user_following  = current_user.following?(@mall)
    @standing_floors    = @mall.standing_floor.blank? ? [] : @mall.standing_floor.split(", ") 
    @stores             = @mall.stores
  end

  def follow
    @mall = Mall.friendly.find params[:mall_id]   
    current_user.follow(@mall)
    if params[:profile]
      respond_to do |format|
        unless params[:following_id]
          format.js { render "user_follower" }
        else        
          format.js { render "user_following" }
        end
        format.html
      end
    else
    end
  end

  def unfollow
    @mall = Mall.friendly.find params[:mall_id]  
    current_user.stop_following(@mall)
    if params[:profile]
      @following_size = current_user.follow_count
      respond_to do |format|
        format.js { render "user_unfollow" }
        format.html
      end
    else
    end
  end

  def import
    Mall.import(params[:file], params[:is_update])
    redirect_to import_administrators_url
  end
  
end