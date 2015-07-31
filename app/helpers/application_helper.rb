module ApplicationHelper
  def display_name user
    if user.firstname.blank? && user.lastname.blank?
      user.email
    else
      "#{user.firstname} #{user.lastname}"
    end
  end
end
