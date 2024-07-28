-- auto-generated definition
create table matches
(
    id           uuid                     default gen_random_uuid() not null
        primary key,
    created_at   timestamp with time zone default now()             not null,
    player_count smallint                                           not null,
    playlist_id  text                                               not null,
    created_by   uuid                     default auth.uid()        not null
);

alter table matches
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on matches to anon;

grant delete, insert, references, select, trigger, truncate, update on matches to authenticated;

grant delete, insert, references, select, trigger, truncate, update on matches to service_role;

