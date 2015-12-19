class RegistrationsController < Devise::RegistrationsController

  protected

  def update_resource(resource, params)
    if needs_password?(resource, params)
      resource.update_with_password(params)
    else
      params.delete(:current_password)
      resource.update_without_password(params)
    end
  end

  private
  def needs_password?(user, params)
    user.email != params[:email] || params[:password].present?
  end

end