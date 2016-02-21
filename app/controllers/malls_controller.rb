class MallsController < ApplicationController
  
  before_action :authenticate_user!
  before_filter :modal_search_exist,       only:[:show]

  def edit
    @mall = Mall.friendly.find params[:id]
  end

  def update
    @mall                 = Mall.friendly.find params[:id]
    @mall.name            = params[:mall][:name]
    @mall.address         = params[:mall][:address]
    @mall.city            = params[:mall][:city]
    @mall.standing_floor  = params[:mall][:standing_floor]
    @mall.latitude        = params[:mall][:latitude]
    @mall.longitude       = params[:mall][:longitude]
    if @mall.save
      redirect_to malls_administrators_path
    else
      render "edit"
    end
  end

  def new
    @mall = Mall.new
  end
  
  def update
    @mall                 = Mall.new
    @mall.name            = params[:mall][:name]
    @mall.address         = params[:mall][:address]
    @mall.city            = params[:mall][:city]
    @mall.standing_floor  = params[:mall][:standing_floor]
    @mall.latitude        = params[:mall][:latitude]
    @mall.longitude       = params[:mall][:longitude]
    if @mall.save
      redirect_to malls_administrators_path
    else
      render "new"
    end
  end

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