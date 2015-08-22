class AddRelationBrandStores < ActiveRecord::Migration
  def change
    add_column :stores,   :brand_id, :integer
  end
end
