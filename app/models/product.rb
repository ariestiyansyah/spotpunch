class Product < ActiveRecord::Base
  
  belongs_to  :brand
  has_many    :reviews
  has_many    :store_product
  has_many    :stores, through: :store_product
end
