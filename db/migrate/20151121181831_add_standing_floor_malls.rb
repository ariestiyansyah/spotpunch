class AddStandingFloorMalls < ActiveRecord::Migration
  def change
    add_column :malls,   :standing_floor, :string
  end
end
