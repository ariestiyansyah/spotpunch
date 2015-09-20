class Product < ActiveRecord::Base
  acts_as_votable
  
  belongs_to  :brand
  has_many    :reviews
  has_many    :store_product
  has_many    :stores, through: :store_product
end
