create database final19
go
use final19 
go
create table bill
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    order_date   date,
    sub_total    float,
    total        float,
    updated_date date,
    address      varchar(255),
    code         varchar(255),
    name         varchar(255),
    phone        varchar(255)
)
go

create unique index UK8q38o07vmn6x2opedgsq9sewo
    on bill (code)
    where [code] IS NOT NULL
go

create table brand
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKg7ft8mes72rnsk746b7ibyln2
    on brand (code)
    where [code] IS NOT NULL
go

create table collar
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKmkxgqkhj5ndjpv1nvcfxdf7t3
    on collar (code)
    where [code] IS NOT NULL
go

create table color
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKcbnc5ktj6whhh690w32k8cyh8
    on color (code)
    where [code] IS NOT NULL
go

create table customer
(
    birth_day    date,
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    email        varchar(255),
    name         varchar(255),
    password     varchar(255),
    phone        varchar(255)
)
go

create table address
(
    created_date date,
    customer_id  int
        constraint FK93c3js0e22ll1xlu21nvrhqgg
            references customer,
    id           int identity
        primary key,
    updated_date date,
    detail       varchar(255),
    phone        varchar(255)
)
go

create unique index UKiw1xq6t67p4p17gr2d5dcrar1
    on customer (code, email, phone)
    where [code] IS NOT NULL AND [email] IS NOT NULL AND [phone] IS NOT NULL
go

create table elasticity
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UK8padggflv5sxp2u68ty11hx91
    on elasticity (code)
    where [code] IS NOT NULL
go

create table history
(
    bill_id      int
        constraint FKnlyavqy1p2ym7ngbv7wwu6umr
            references bill,
    created_date date,
    id           int identity
        primary key,
    updated_date date,
    note         varchar(255),
    status       varchar(255)
        check ([status] = 'FAILED' OR [status] = 'CANCELLED' OR [status] = 'PENDING' OR [status] = 'SUCCESS')
)
go

create table image
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKf8554665e4e0t819jc07asw22
    on image (code)
    where [code] IS NOT NULL
go

create table material
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKt9kjl2b3iqg9sv9xe06fcxcya
    on material (code)
    where [code] IS NOT NULL
go

create table origin
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UK7e5g3f1j7w3jfye6tninigdro
    on origin (code)
    where [code] IS NOT NULL
go

create table payment
(
    created_date date,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255)
)
go

create unique index UKopor0kv54jt58n364jog9bu2i
    on payment (code)
    where [code] IS NOT NULL
go

create table product
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKh3w5r1mx6d0e5c6um32dgyjej
    on product (code)
    where [code] IS NOT NULL
go

create table role
(
    created_date date,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255)
)
go

create unique index UKc36say97xydpmgigg38qv5l2p
    on role (code)
    where [code] IS NOT NULL
go

create table size
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UK2cl2qxxrob1p3d291xr99no9j
    on size (code)
    where [code] IS NOT NULL
go

create table sleeve
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKxeixx6xuy44keusgk80bicdd
    on sleeve (code)
    where [code] IS NOT NULL
go

create table staff
(
    birth_day    date,
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    role_id      int
        constraint FK5bbdfuitxii0b63v2v3f0r22x
            references role,
    updated_date date,
    address      varchar(255),
    citizen_id   varchar(255),
    code         varchar(255),
    district     varchar(255),
    email        varchar(255),
    name         varchar(255),
    note         varchar(255),
    password     varchar(255),
    phone        varchar(255),
    province     varchar(255),
    status       varchar(255),
    ward         varchar(255)
)
go

create table cart
(
    created_date date,
    id           int identity
        primary key,
    staff_id     int
        constraint FKrdd1t50ij6m23rtc7n9tospix
            references staff,
    updated_date date,
    status       varchar(255)
        check ([status] = 'PENDING' OR [status] = 'SUCCESS')
)
go

create unique index UKr4h7xlxecyyylk0xdc7u0f7lf
    on staff (code, email, phone)
    where [code] IS NOT NULL AND [email] IS NOT NULL AND [phone] IS NOT NULL
go

create table style
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKqiy003f5r7e6ey7l5y3apiu76
    on style (code)
    where [code] IS NOT NULL
go

create table texture
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create unique index UKltw1388iiex1fh3yyexn8ll9s
    on texture (code)
    where [code] IS NOT NULL
go

create table thickness
(
    created_date date,
    deleted      bit,
    id           int identity
        primary key,
    updated_date date,
    code         varchar(255),
    name         varchar(255)
)
go

create table product_detail
(
    brand_id      int
        constraint FKn29xx33y0vxapbc6ntf4kldxr
            references brand,
    collar_id     int
        constraint FKrs2l68eovv4jbptsnrw9xxk29
            references collar,
    color_id      int
        constraint FK99vj2np1gk1robp8n6htiweii
            references color,
    created_date  date,
    deleted       bit,
    elasticity_id int
        constraint FKebv5c5kn3d3sxjjken6xm8ewa
            references elasticity,
    id            int identity
        primary key,
    image_id      int
        constraint FKlk351wm82fyehkqmb1lki65h6
            references image,
    material_id   int
        constraint FKelrbk54wt31vv07h3us1gap2c
            references material,
    origin_id     int
        constraint FKnb3b3wpn7hlkbs5o6vhonn46c
            references origin,
    price         float,
    product_id    int
        constraint FKilxoi77ctyin6jn9robktb16c
            references product,
    quantity      int,
    size_id       int
        constraint FKcum8u2vfvebmmc4xo8de3k35s
            references size,
    sleeve_id     int
        constraint FKaulbngl3gskh8tll54wyh5ckg
            references sleeve,
    style_id      int
        constraint FK56s4hqmp09omp2w84hijq3jyc
            references style,
    texture_id    int
        constraint FKkk0ba59xpfjat6ceh4fms3ljw
            references texture,
    thickness_id  int
        constraint FKo97vo0ox06s9fp5dxh6dq2san
            references thickness,
    updated_date  date,
    code          varchar(255),
    name          varchar(255)
)
go

create table bill_detail
(
    bill_id           int
        constraint FKeolgwyayei3o80bb7rj7t207q
            references bill,
    created_date      date,
    id                int identity
        primary key,
    product_detail_id int
        constraint FK5wgs68xq0wq0ebia10snilq9v
            references product_detail,
    quantity          int,
    updated_date      date
)
go

create unique index UK18yn4vr4gusinr921wec1ui0w
    on bill_detail (bill_id)
    where [bill_id] IS NOT NULL
go

create table cart_detail
(
    cart_id           int
        constraint FKrg4yopd2252nwj8bfcgq5f4jp
            references cart,
    created_date      date,
    id                int identity
        primary key,
    product_detail_id int
        constraint FK3c8gudcdnngwh5k2g2n25kkqk
            references product_detail,
    quantity          int,
    updated_date      date
)
go

create unique index UKndx952w0v9kxawibxhciotx1w
    on product_detail (code)
    where [code] IS NOT NULL
go

create unique index UKnkdkv6j2y4egsd7j34hf0xbvt
    on thickness (code)
    where [code] IS NOT NULL
go

create table voucher
(
    created_date date,
    deleted      bit,
    end_date     date,
    id           int identity
        primary key,
    max_percent  int,
    min_amount   int,
    quantity     int,
    start_date   date,
    updated_date date,
    code         varchar(255),
    name         varchar(255),
    type_ticket  varchar(255)
)
go

create unique index UKpvh1lqheshnjoekevvwla03xn
    on voucher (code)
    where [code] IS NOT NULL
go

create table voucher_customer
(
    customer_id int not null
        constraint FKq63rrti3v4ap5eejsod9x45y3
            references voucher,
    voucher_id  int not null
        constraint FKbplw48armhqj6htasirqwxi7x
            references customer
)
go

