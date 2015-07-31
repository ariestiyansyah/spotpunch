class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def authenticate_user! opts={}
    @user = User.new
    unless user_signed_in?
      render "users/sessions/new"
    end
  end
end
