import { Entity, Column, PrimaryColumn} from "typeorm";


@Entity()
export class SummonerGraph{
    
    @PrimaryColumn()
    summonerpuuid:string

    @Column()
    name: string;

    @Column()
    nivel: string;

    @Column()
    urlimg: string;

}