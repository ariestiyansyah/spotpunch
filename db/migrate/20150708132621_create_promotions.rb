class CreatePromotions < ActiveRecord::Migration
  def change
    create_table :promotions do |t|
      t.string        :name
      t.text          :description
      t.integer       :store_id
      t.timestamps null: false
    end
  end
end
