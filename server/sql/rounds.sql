-- auto-generated definition
create table rounds
(
    id          bigint generated by default as identity
        primary key,
    match_id    uuid                    not null
        references matches,
    user_id     uuid default auth.uid() not null
        references ??? (),
    user_index  smallint                not null,
    track_index integer                 not null,
    success     boolean                 not null
);

alter table rounds
    owner to postgres;

grant select, update, usage on sequence rounds_id_seq to anon;

grant select, update, usage on sequence rounds_id_seq to authenticated;

grant select, update, usage on sequence rounds_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on rounds to anon;

grant delete, insert, references, select, trigger, truncate, update on rounds to authenticated;

grant delete, insert, references, select, trigger, truncate, update on rounds to service_role;

