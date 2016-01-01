class StoresController < ApplicationController
  before_action :authenticate_user!
  before_filter :modal_search_exist,       only:[:index, :show]

  def show
    @mall               = Mall.find_by_permalink params[:name]
    @store              = @mall.stores.find_by permalink: params[:permalink]
    @products           = @store.products 
    @is_user_following  = current_user.following?(@store)
  end

  def follow
    @store = Store.find_by_id params[:store_id]  
    current_user.follow(@store)
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
    @store = Store.find_by_id params[:store_id]  
    current_user.stop_following(@store)
    if params[:profile]
      @following_size = current_user.follow_count
      respond_to do |format|
        format.js { render "user_unfollow" }
        format.html
      end
    else
    end
  end

  def index
    @malls = Mall.all.includes(:stores)
  end

end
