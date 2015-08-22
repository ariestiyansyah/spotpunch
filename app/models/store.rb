class Store < ActiveRecord::Base
  belongs_to :brand
  belongs_to :mall
end
