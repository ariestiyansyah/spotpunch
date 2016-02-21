class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  validates :username, uniqueness: true

  acts_as_followable
  acts_as_follower
  acts_as_voter

  has_one   :permalink, as: :linkable
  has_many  :reviews
  has_one   :image,       as: :imageable

  has_many :user_roles
  has_many :roles, through: :user_roles

  def is_admin
    !roles.where(name:"Admin").blank?
  end

  def add_image file
    unless file.blank?
      if image.blank?
        img           = Image.new
        img.imageable = self
      else
        img           = self.image
      end
      img.avatar      = file
      img.save
    end
  end
end
