class Brand < ActiveRecord::Base
  acts_as_followable
  has_many  :stores
  has_one   :permalink, as: :linkable
end
