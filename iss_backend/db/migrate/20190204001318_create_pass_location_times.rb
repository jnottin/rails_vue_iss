class CreatePassLocationTimes < ActiveRecord::Migration[5.2]
  def change
    create_table :pass_location_times do |t|
      t.string :location
      t.integer :lat
      t.integer :lng
      t.string :passes

      t.timestamps
    end
  end
end
