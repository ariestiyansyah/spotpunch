class HomeController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @user   = User.new
    @apple  = Store.find_by_name "Apple"
    @uniqlo = Store.find_by_name "Uniqlo" 
  end

  def profile
    @user = current_user
  end

end
