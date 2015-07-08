class CreateMalls < ActiveRecord::Migration
  def change
    create_table :malls do |t|
      t.string      :name
      t.string      :address
      t.string      :latitude
      t.string      :longitude
      t.string      :city
      t.timestamps null: false
    end
  end
end
