class Brand < ActiveRecord::Base
  acts_as_followable
  has_many  :stores
  has_many  :products
  has_one   :permalink, as: :linkable
end
