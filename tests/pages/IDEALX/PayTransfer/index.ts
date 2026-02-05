// pages/PaymentsPages.ts
import type { Page } from '@playwright/test';

import { AccountTransferPage } from './AccountTransferPage';
import { TransferCentersPage } from './TransferCenterPage';
import { PayrollPage } from './PayrollPage';
/*import { LVTPaymentPage } from './LVTPaymentPage';
import { AutoPayPaymentPage } from './AutoPayPaymentPage';
import { PaymentViaPartnerBankPage } from './PaymentViaPartnerBankPage';
// NOTE: file name adjusted to Playwright version we created earlier.

import { TelegraphicTransferPage } from './TelegraphicTransferPage';
import { IntraCompanyTransferPage } from './IntraCompanyTransferPage';
import { FastPaymentPage } from './FastPaymentPage'; 

import { NewFastCollectionPage } from './NewFastCollectionPage';
import { BulkCollectionPage } from './BulkCollectionPage';
import { BulkPaymentPage } from './BulkPaymentPage';
import { MEPSPaymentPage } from './MEPSPaymentPage';
import { NewBillPaymentPage } from './NewBillPaymentPage';
import { PaymentTemplatesPage } from './PaymentTemplatesPage';
import { BeneficiaryPage } from './BeneficiaryPage';
import { CrossBoarderACHPage } from './CrossBoarderACHPage';
import { HVTPaymentPage } from './HVTPaymentPage';
import { CNAPSPaymentPage } from './CNAPSPaymentPage';
import { HKCHATSPaymentPage } from './HKCHATSPaymentPage';
import { FPSPaymentPage } from './FPSPaymentPage';
import { RTGSPaymentPage } from './RTGSPaymentPage';
import { SKNPaymentPage } from './SKNPaymentPage';
import { ITTPage } from './ITTPage';
import { NEFTPaymentPage } from './NEFTPaymentPage';
import { FixedDepositPlacementPage } from './FixedDepositPlacementPage';
import { PartnerBankPaymentPage } from './PartnerBankPaymentPage';
import { TWACHBulkPaymentPage } from './TWACHBulkPaymentPage';
import { CustomPaymentPage } from './CustomPaymentPage';
import { VNLvtPage } from './VNLvtPage';
import { TWFISCPaymentPage } from './TWFISCPaymentPage';
import { PaymentLimit } from './PaymentLimit';
import { ChequePaymentPage } from './ChequePaymentPage';
import { DemandDraftPaymentPage } from './DemandDraftPaymentPage';
import { MT101PaymentPage } from './MT101PaymentPage';
import { GiroPaymentPage } from './GiroPaymentPage';
import { eACHPaymentPage } from './eACHPaymentPage';
import { IBPSPaymentPage } from './IBPSPaymentPage';
import { RTOLPaymentPage } from './RTOLPaymentPage'; */

export {
  AccountTransferPage,
  TransferCentersPage,
  PayrollPage,
 /* LVTPaymentPage,
  AutoPayPaymentPage,
  PaymentViaPartnerBankPage,
  
  TelegraphicTransferPage,
  IntraCompanyTransferPage,
  FastPaymentPage,
  
  NewFastCollectionPage,
  BulkCollectionPage,
  BulkPaymentPage,
  MEPSPaymentPage,
  NewBillPaymentPage,
  PaymentTemplatesPage,
  BeneficiaryPage,
  CrossBoarderACHPage,
  HVTPaymentPage,
  CNAPSPaymentPage,
  HKCHATSPaymentPage,
  FPSPaymentPage,
  RTGSPaymentPage,
  SKNPaymentPage,
  ITTPage,
  NEFTPaymentPage,
  FixedDepositPlacementPage,
  PartnerBankPaymentPage,
  TWACHBulkPaymentPage,
  CustomPaymentPage,
  VNLvtPage,
  TWFISCPaymentPage,
  PaymentLimit,
  ChequePaymentPage,
  DemandDraftPaymentPage,
  MT101PaymentPage,
  GiroPaymentPage,
  eACHPaymentPage,
  IBPSPaymentPage,
  RTOLPaymentPage, */
};

export class PaymentsPages {
  public AccountTransferPage: AccountTransferPage;
  public TransferCentersPage: TransferCentersPage;
  public PayrollPage: PayrollPage;
  /*public LVTPaymentPage: LVTPaymentPage;
  public AutoPayPaymentPage: AutoPayPaymentPage;
  public PaymentViaPartnerBankPage: PaymentViaPartnerBankPage;
  public TelegraphicTransferPage: TelegraphicTransferPage;
  public IntraCompanyTransferPage: IntraCompanyTransferPage;
  public FastPaymentPage: FastPaymentPage;
  
  public NewFastCollectionPage: NewFastCollectionPage;
  public BulkCollectionPage: BulkCollectionPage;
  public BulkPaymentPage: BulkPaymentPage;
  public MEPSPaymentPage: MEPSPaymentPage;
  public NewBillPaymentPage: NewBillPaymentPage;
  public PaymentTemplatesPage: PaymentTemplatesPage;
  public BeneficiaryPage: BeneficiaryPage;
  public CrossBoarderACHPage: CrossBoarderACHPage;
  public HVTPaymentPage: HVTPaymentPage;
  public CNAPSPaymentPage: CNAPSPaymentPage;
  public HKCHATSPaymentPage: HKCHATSPaymentPage;
  public FPSPaymentPage: FPSPaymentPage;
  public RTGSPaymentPage: RTGSPaymentPage;
  public SKNPaymentPage: SKNPaymentPage;
  public ITTPage: ITTPage;
  public NEFTPaymentPage: NEFTPaymentPage;
  public FixedDepositPlacementPage: FixedDepositPlacementPage;
  public PartnerBankPaymentPage: PartnerBankPaymentPage;
  public TWACHPaymentPage: TWACHBulkPaymentPage;
  public CustomPaymentPage: CustomPaymentPage;
  public VNLvtPage: VNLvtPage;
  public TWFISCPaymentPage: TWFISCPaymentPage;
  public PaymentLimit: PaymentLimit;
  public chequePaymentPage: ChequePaymentPage;
  public demandDraftPaymentPage: DemandDraftPaymentPage;
  public mt101PaymentPage: MT101PaymentPage;
  public giroPaymentPage: GiroPaymentPage;
  public eACHPaymentPage: eACHPaymentPage;
  public IBPSPaymentPage: IBPSPaymentPage;
  public RTOLPaymentPage: RTOLPaymentPage; */

  constructor(private readonly page: Page) {
    this.AccountTransferPage = new AccountTransferPage(page);
    this.TransferCentersPage = new TransferCentersPage(page);
    this.PayrollPage = new PayrollPage(page);

    /*this.LVTPaymentPage = new LVTPaymentPage(page);
    this.AutoPayPaymentPage = new AutoPayPaymentPage(page);
    this.PaymentViaPartnerBankPage = new PaymentViaPartnerBankPage(page);
    
    this.TelegraphicTransferPage = new TelegraphicTransferPage(page);
    this.IntraCompanyTransferPage = new IntraCompanyTransferPage(page);
    this.FastPaymentPage = new FastPaymentPage(page);
    
    this.NewFastCollectionPage = new NewFastCollectionPage(page);
    this.BulkCollectionPage = new BulkCollectionPage(page);
    this.BulkPaymentPage = new BulkPaymentPage(page);
    this.MEPSPaymentPage = new MEPSPaymentPage(page);
    this.NewBillPaymentPage = new NewBillPaymentPage(page);
    this.PaymentTemplatesPage = new PaymentTemplatesPage(page);
    this.BeneficiaryPage = new BeneficiaryPage(page);
    this.CrossBoarderACHPage = new CrossBoarderACHPage(page);
    this.HVTPaymentPage = new HVTPaymentPage(page);
    this.CNAPSPaymentPage = new CNAPSPaymentPage(page);
    this.HKCHATSPaymentPage = new HKCHATSPaymentPage(page);
    this.FPSPaymentPage = new FPSPaymentPage(page);
    this.RTGSPaymentPage = new RTGSPaymentPage(page);
    this.SKNPaymentPage = new SKNPaymentPage(page);
    this.ITTPage = new ITTPage(page);
    this.NEFTPaymentPage = new NEFTPaymentPage(page);
    this.FixedDepositPlacementPage = new FixedDepositPlacementPage(page);
    this.PartnerBankPaymentPage = new PartnerBankPaymentPage(page);
    this.TWACHPaymentPage = new TWACHBulkPaymentPage(page);
    this.CustomPaymentPage = new CustomPaymentPage(page);
    this.VNLvtPage = new VNLvtPage(page);
    this.TWFISCPaymentPage = new TWFISCPaymentPage(page);
    this.PaymentLimit = new PaymentLimit(page);
    this.chequePaymentPage = new ChequePaymentPage(page);
    this.demandDraftPaymentPage = new DemandDraftPaymentPage(page);
    this.mt101PaymentPage = new MT101PaymentPage(page);
    this.giroPaymentPage = new GiroPaymentPage(page);
    this.eACHPaymentPage = new eACHPaymentPage(page);
    this.IBPSPaymentPage = new IBPSPaymentPage(page);
    this.RTOLPaymentPage = new RTOLPaymentPage(page); */
  }
}