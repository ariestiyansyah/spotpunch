class Review < ActiveRecord::Base
  belongs_to :product
  belongs_to :store
  include PublicActivity::Model
  # tracked
end
