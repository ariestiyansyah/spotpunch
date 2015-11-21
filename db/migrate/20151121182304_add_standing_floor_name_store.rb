class AddStandingFloorNameStore < ActiveRecord::Migration
  def change
    add_column :stores,   :standing_floor_name, :string
  end
end
