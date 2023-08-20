import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
/**
 * @dev
 * these decorators are going to help TypeORM understand some of the different properties that we are going to add to our entity
 */

/**
 * @Entity
 * @Entity() decorator tells TypeORM that it needs to take a look at this class,
 * and it needs to create a new table to model this class
 */
@Entity()
export class User {
    /**
     * @PrimaryGeneratedColumn
     * @PrimaryGeneratedColumn() decorator is going to be read in by TypeORM,
     * and it's going to cause TypeORM to take a look at the table and add a new column into it
     * That column is going to serve as the automatically generated primary key
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * @Column
     * @Column() decorator is going to create a column inside the table
     */
    @Column()
    email: string;

    @Column()
    password: string;
}
