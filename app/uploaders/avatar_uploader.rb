# encoding: utf-8

class AvatarUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  # storage :file
  storage :azure
  after :remove, :delete_empty_upstream_dirs
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  def delete_empty_upstream_dirs
    path = ::File.expand_path(store_dir, root)
    Dir.delete(path) # fails if path not empty dir
    
    rescue SystemCallError
    true # nothing, the dir is not empty
  end

  # 64 x 64 thumb profile
  # 128 x 128 larage profile

  # 64 x 64 brand product
  # 250 x 250 product

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  version :thumb do
    process :auto_orient
    process :resize_to_fill => [64, 64], :if => :is_landscape?
    process :resize_to_fit => [64, 64], :if => :is_portrait?
  end

  version :large do
    process :auto_orient
    process :resize_to_fill => [128, 128], :if => :is_landscape?
    process :resize_to_fit => [128, 128], :if => :is_portrait?
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # def filename
  #   # if original_filename
  #   #   if model && model.read_attribute(mounted_as).present?
  #   #     model.read_attribute(mounted_as)
  #   #   else
  #   #     @name ||= "#{mounted_as}-#{uuid}.#{file.extension}"
  #   #   end
  #   # end

  #   "#{mounted_as}-#{uuid}.#{file.extension}" if original_filename.present?
  # end

  def filename
    if original_filename
      if model && model.read_attribute(mounted_as).present?
        model.read_attribute(mounted_as)
      else
        @name ||= "#{mounted_as}-#{uuid}.#{file.extension}"
      end
    end
  end

  def auto_orient
    manipulate! do |image|
      image.tap(&:auto_orient)
    end
  end

  protected

  def uuid
    time = Time.new
    time.to_i
  end

  def is_user? picture
    model.imageable.class.name == "User"
  end

  def is_landscape? picture
    image = MiniMagick::Image.open(picture.path)
    image.auto_orient
    image[:width] >= image[:height]
  end

  def is_portrait? picture
    image = MiniMagick::Image.open(picture.path)
    image.auto_orient
    image[:width] < image[:height]
  end

end
