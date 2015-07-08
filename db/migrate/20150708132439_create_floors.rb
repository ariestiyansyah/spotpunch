class CreateFloors < ActiveRecord::Migration
  def change
    create_table :floors do |t|
      t.string  :name
      t.timestamps null: false
    end
  end
end
