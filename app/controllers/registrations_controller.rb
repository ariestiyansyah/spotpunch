class RegistrationsController < Devise::RegistrationsController

  def update
    @user = current_user
    @user.add_image params[:user][:image]
    successfully_updated = if needs_password?(@user, params[:user])
      @user.update_with_password(devise_parameter_sanitizer.sanitize(:account_update))
    else
      params[:user].delete(:current_password)
      @user.update_without_password(devise_parameter_sanitizer.sanitize(:account_update))
    end
    if successfully_updated
      set_flash_message :success, :updated
      sign_in @user, :bypass => true
      redirect_to root_path
    else
      render "edit"
    end
  end

  private
  def needs_password?(user, params)
    user.email != params[:email] || params[:password].present?
  end

end