class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_filter :configure_permitted_parameters, if: :devise_controller?

  def authenticate_user! opts={}
    @user = User.new
    unless user_signed_in?
      render "users/sessions/new"
    end
  end

  protected
    def configure_permitted_parameters
      devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:username, 
        :email, 
        :password, 
        :password_confirmation, 
        :firstname, 
        :lastname) }
    end
end
