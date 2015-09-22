class UsersController < ApplicationController

  def follow
    @user = User.find_by_id params[:user_id]  
    current_user.follow(@user)
    @follower_size = @user.followers_count
    if params[:profile]
      @following_size = current_user.follow_count
      respond_to do |format|
        format.js { render "user_follower" }
        format.html
      end
    else
    end
  end

  def unfollow
    @user = User.find_by_id params[:user_id] 
    current_user.stop_following(@user)
    @follower_size = @user.followers_count
    if params[:profile]
      @following_size = current_user.follow_count
      respond_to do |format|
        format.js { render "user_unfollower" }
        format.html
      end
    else
    end
  end

end
