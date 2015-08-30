class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  validates :username, uniqueness: true

  acts_as_followable
  acts_as_follower

  has_one   :permalink, as: :linkable
  has_many  :reviews
end
