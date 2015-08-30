class Review < ActiveRecord::Base
  belongs_to :product
  include PublicActivity::Model
  # tracked
end
