module ApplicationHelper
  def display_name user
    if user.firstname.blank? && user.lastname.blank?
      user.email
    else
      "#{user.firstname} #{user.lastname}"
    end
  end

  def display_list_image_profile model
    case model.class.name
    when "Brand"
      link_to "#", class: "list-photo" do
        '<img src="images/photo/photo02.jpg" alt="logo" />'.html_safe
      end
    when "Store"
      link_to "#", class: "list-photo" do
        '<img src="images/photo/photo02.jpg" alt="logo" />'.html_safe
      end
    when "User"
      link_to profile_path(permalink:model.username), class: "list-photo" do
        '<img src="images/photo/photo02.jpg" alt="logo" />'.html_safe
      end
    end
  end

  def display_list_name_profile model
    case model.class.name
    when "Brand"
      link_to model.name, "#"
    when "Store"
      link_to model.name, "#"
    when "User"
      link_to display_name(model), profile_path(permalink:model.username)
    end
  end

  def display_list_username_profile model
    case model.class.name
    when "Brand"
      link_to "@#{model.name}", "#"
    when "Store"
      link_to "@#{model.name}", "#"
    when "User"
      link_to "@#{model.username}", profile_path(permalink:model.username)
    end
  end

end
