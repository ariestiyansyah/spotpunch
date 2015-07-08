class CreateStores < ActiveRecord::Migration
  def change
    create_table :stores do |t|
      t.string      :name
      t.integer     :mall_id
      t.integer     :floor_id
      t.integer     :category_id
      t.timestamps null: false
    end
  end
end
