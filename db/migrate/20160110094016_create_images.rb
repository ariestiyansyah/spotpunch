class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string      :avatar
      t.timestamps null: false
      t.references  :imageable, polymorphic: true
    end
  end
end
