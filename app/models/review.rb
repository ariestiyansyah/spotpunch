class Review < ActiveRecord::Base

  acts_as_votable

  belongs_to :product
  belongs_to :store
  belongs_to :user
  include PublicActivity::Model
  # tracked
end
