import { BaseDto } from '../base.dto'
import { PaginationOptions } from '../pagination.dto'
import { DeveloperDto } from './developer.dto'
import { GametypeDto } from './gametype.dto'
import { GenreDto } from './genre.dto'
import { PlatformDto } from './platform.dto'
import { PublisherDto } from './publisher.dto'
import { SeriesDto } from './series.dto'

// # GAME
type igame = {
  name: string
  cover?: File | null
  platforms?: Array<PlatformDto>
  genres?: Array<GenreDto>
  release_date: Date
  slug: string
  series?: Array<SeriesDto>
  developers?: Array<DeveloperDto>
  publishers?: Array<PublisherDto>
  gametype: GametypeDto
  children?: Array<GameDto>
}

type Cover = {
  readonly filename: string
  readonly uri: string
}

type game = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  release_date: Date
  slug: string
  platforms: Array<PlatformDto>
  genres: Array<GenreDto>
  cover: Cover | null
  series: Array<SeriesDto>
  developers: Array<DeveloperDto>
  publishers: Array<PublisherDto>
  gametype: GametypeDto
  children: Array<game>
  playthroughs: Array<any>
}

class CreateGameDto {
  public readonly name: string
  public readonly release_date: Date
  public readonly slug: string
  public readonly platform_ids?: Array<string>
  public readonly genre_ids?: Array<string>
  public readonly series_ids?: Array<string>
  public readonly developer_ids?: Array<string>
  public readonly publisher_ids?: Array<string>
  public readonly gametype_id: string
  public readonly cover?: File
  public readonly related_ids?: Array<string>

  constructor(params: igame) {
    this.name = params.name
    this.release_date = params.release_date
    this.slug = params.slug
    this.cover = params.cover || undefined
    this.platform_ids = params.platforms?.map((platform: PlatformDto) => platform.id)
    this.genre_ids = params.genres?.map((genre: GenreDto) => genre.id)
    this.series_ids = params.series?.map((series: SeriesDto) => series.id)
    this.developer_ids = params.developers?.map((developer: DeveloperDto) => developer.id)
    this.publisher_ids = params.publishers?.map((publisher: PublisherDto) => publisher.id)
    this.gametype_id = params.gametype.id
    this.related_ids = params.children?.map((game: GameDto) => game.id)
  }
}

class GamePagineationOptions extends PaginationOptions {
  public platforms?: Array<string> = []
  public genres?: Array<string> = []
  public series?: Array<string> = []
  public developers?: Array<string> = []
  public publishers?: Array<string> = []
  public gametypes?: Array<string> = []
}

class GameDto extends BaseDto {
  public readonly name: string
  public readonly release_date: Date
  public readonly slug: string
  public readonly platforms: Array<PlatformDto>
  public readonly genres: Array<GenreDto>
  public readonly cover?: string
  public readonly series: Array<SeriesDto>
  public readonly developers: Array<DeveloperDto>
  public readonly publishers: Array<PublisherDto>
  public readonly gametype?: GametypeDto
  public readonly children: Array<GameDto>

  constructor(params: game) {
    super(params)

    this.name = params.name
    this.slug = params.slug

    this.release_date = new Date(params.release_date)
    this.gametype = params.gametype ? new GametypeDto(params.gametype) : undefined

    this.cover = params.cover?.uri

    this.platforms = params.platforms
      ?.map((platform) => new PlatformDto(platform))
      .sort(function (a: PlatformDto, b: PlatformDto) {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      })
    this.series = params.series
      ?.map((series) => new SeriesDto(series))
      .sort(function (a: SeriesDto, b: SeriesDto) {
        return a.name.localeCompare(b.name)
      })

    this.genres = params.genres
      ?.map((genre) => new GenreDto(genre))
      .sort(function (a: GenreDto, b: GenreDto) {
        return a.name.localeCompare(b.name)
      })

    this.developers = params.developers
      ?.map((developer) => new DeveloperDto(developer))
      .sort(function (a: DeveloperDto, b: DeveloperDto) {
        return a.name.localeCompare(b.name)
      })

    this.publishers = params.publishers
      ?.map((publisher) => new PublisherDto(publisher))
      .sort(function (a: PublisherDto, b: PublisherDto) {
        return a.name.localeCompare(b.name)
      })

    this.children = params.children
      ?.map((child) => new GameDto(child))
      .sort(function (a: GameDto, b: GameDto) {
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
      })
  }
}

export { GameDto, CreateGameDto, GamePagineationOptions }
export type { game, igame }
