class AddPriceProduct < ActiveRecord::Migration
  def change
    add_column :products,   :price,  :integer
  end
end