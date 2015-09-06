class Review < ActiveRecord::Base
  belongs_to :product
  belongs_to :store
  belongs_to :user
  include PublicActivity::Model
  # tracked
end
